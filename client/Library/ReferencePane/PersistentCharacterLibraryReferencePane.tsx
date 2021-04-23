import * as React from "react";

import { PersistentCharacter } from "../../../common/PersistentCharacter";
import { linkComponentToObservables } from "../../Combatant/linkComponentToObservables";
import { LibrariesCommander } from "../../Commands/LibrariesCommander";
import { StatBlockComponent } from "../../Components/StatBlock";
import { TextEnricher } from "../../TextEnricher/TextEnricher";
import { GetAlphaSortableLevelString } from "../../Utility/GetAlphaSortableLevelString";
import { Listing } from "../Listing";
import { PersistentCharacterLibrary } from "../PersistentCharacterLibrary";
import { ListingGroupFn } from "../Components/BuildListingTree";
import { LibraryReferencePane } from "./LibraryReferencePane";
import { ListingRow } from "../Components/ListingRow";

export type PersistentCharacterLibraryReferencePaneProps = {
  librariesCommander: LibrariesCommander;
  library: PersistentCharacterLibrary;
  statBlockTextEnricher: TextEnricher;
};

export class PersistentCharacterLibraryReferencePane extends React.Component<
  PersistentCharacterLibraryReferencePaneProps
> {
  constructor(props: PersistentCharacterLibraryReferencePaneProps) {
    super(props);
    linkComponentToObservables(this);
  }

  private loadSavedStatBlock = (
    listing: Listing<PersistentCharacter>,
    hideOnAdd: boolean
  ) => {
    if (!this.props.librariesCommander.CanAddPersistentCharacter(listing)) {
      return false;
    }

    this.props.librariesCommander.AddPersistentCharacterFromListing(
      listing,
      hideOnAdd
    );

    return true;
  };

  private editStatBlock = (l: Listing<PersistentCharacter>) => {
    const subscription = l.Meta.subscribe(() => {
      this.forceUpdate(() => subscription.dispose());
    });
    this.props.librariesCommander.EditPersistentCharacterStatBlock(
      l.Meta().Id
    );
  };

  private createAndEditStatBlock = () => {
    const listing = this.props.librariesCommander.CreatePersistentCharacter();
    this.editStatBlock(listing);
  };

  private renderListingRow = (
    l: Listing<PersistentCharacter>,
    onPreview,
    onPreviewOut
  ) => {
    const listingMeta = l.Meta();
    return (
      <ListingRow
        key={listingMeta.Id + listingMeta.Path + listingMeta.Name}
        name={listingMeta.Name}
        showCount
        onAdd={this.loadSavedStatBlock}
        onEdit={this.editStatBlock}
        onPreview={onPreview}
        onPreviewOut={onPreviewOut}
        listing={l}
      />
    );
  };

  public render() {
    const listings = this.props.library.GetListings();

    return (
      <LibraryReferencePane
        defaultItem={PersistentCharacter.Default()}
        listings={listings}
        renderListingRow={this.renderListingRow}
        groupByFunctions={this.groupingFunctions}
        addNewItem={this.createAndEditStatBlock}
        renderPreview={character => (
          <StatBlockComponent
            statBlock={character.StatBlock}
            displayMode="default"
          />
        )}
      />
    );
  }

  private groupingFunctions: ListingGroupFn[] = [
    l => ({
      key: l.Meta().Path
    }),
    l => ({
      label: "Level " + l.Meta().FilterDimensions.Level,
      key: GetAlphaSortableLevelString(l.Meta().FilterDimensions.Level)
    }),
    l => ({
      key: l.Meta().FilterDimensions.Source
    }),
    l => ({
      key: l.Meta().FilterDimensions.Type
    })
  ];
}